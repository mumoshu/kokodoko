# -*- coding: utf-8 -*-
class MarksController < ApplicationController
  nested_layout
  before_filter :set_up
  before_filter :authorize  

  # GET /marks
  # GET /marks.xml
  def index
    @marks = @quiz.marks

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @marks }
    end
  end

  # GET /marks/1
  # GET /marks/1.xml
  def show
    @mark = @quiz.marks.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @mark }
    end
  end

  # GET /marks/new
  # GET /marks/new.xml
  def new
    @mark = Mark.new
    if last = @quiz.marks.find(:last)
      @mark.quiz_id = last.quiz_id
      @mark.lat = last.lat
      @mark.lng = last.lng
    else
      @mark.lat = 35.61975622603792
      @mark.lng = 139.72841262817383
    end

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @mark }
    end
  end

  # GET /marks/1/edit
  def edit
    @mark = @quiz.marks.find(params[:id])
  end

  # POST /marks
  # POST /marks.xml
  def create
    @mark = Mark.new(params[:mark])
    @mark.quiz_id = @quiz.id

    respond_to do |format|
      if @mark.save
        flash[:notice] = "#{@mark.title}を追加しました。"
#        format.html { redirect_to([@quiz,@mark]) }
        format.html { redirect_to :controller => :marks, :action => :new, :quiz_id => @quiz.id }
        format.xml  { render :xml => @mark, :status => :created, :location => [@quiz,@mark] }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @mark.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /marks/1
  # PUT /marks/1.xml
  def update
    @mark = @quiz.marks.find(params[:id])

    respond_to do |format|
#      if @mark.update_attributes(params[:mark])
      if @mark.update_attributes(params[:mark].merge(:quiz_id => params[:quiz_id]))

        flash[:notice] = 'Mark was successfully updated.'
#        format.html { redirect_to(@mark) }
        format.html { redirect_to([@quiz,@mark]) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @mark.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /marks/1
  # DELETE /marks/1.xml
  def destroy
    @mark = @quiz.marks.find(params[:id])
    @mark.destroy

    respond_to do |format|
      format.html { redirect_to(quiz_marks_url) }
      format.xml  { head :ok }
    end
  end

  def set_up
    @quiz = Quiz.find(params[:quiz_id])
  end
end
