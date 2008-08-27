# -*- coding: utf-8 -*-
class ScoresController < ApplicationController
  before_filter :set_up

  # GET /scores
  # GET /scores.xml
  def index
    @scores = (@user || @quiz).scores

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @scores }
    end
  end

  # GET /scores/1
  # GET /scores/1.xml
  def show
    @score = Score.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @score }
    end
  end

  # GET /scores/new
  # GET /scores/new.xml
  def new
    @score = Score.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @score }
    end
  end

  # GET /scores/1/edit
  def edit
    @score = Score.find(params[:id])
  end

  # POST /scores
  # POST /scores.xml
  def create
    @score = Score.new(params[:score])
    
    unless @score.user_id
      return respond_to do |format|
        flash[:notice] = "あたなの #{@score.quiz.title} の点数は #{@score.score}点 でした。"
        format.html { redirect_to :controller => "quizzes", :action => "index" }
      end
    end

    respond_to do |format|
      if @score.save
        flash[:notice] = 'Score was successfully created.'
        format.html { redirect_to(@score) }
        format.xml  { render :xml => @score, :status => :created, :location => @score }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @score.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /scores/1
  # PUT /scores/1.xml
  def update
    @score = Score.find(params[:id])

    respond_to do |format|
      if @score.update_attributes(params[:score])
        flash[:notice] = 'Score was successfully updated.'
        format.html { redirect_to(@score) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @score.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /scores/1
  # DELETE /scores/1.xml
  def destroy
    @score = Score.find(params[:id])
    @score.destroy

    respond_to do |format|
      format.html { redirect_to(scores_url) }
      format.xml  { head :ok }
    end
  end

  def set_up
    @quiz = Quiz.find(params[:quiz_id]) if params[:quiz_id]
    @user = User.find(params[:user_id]) if params[:user_id]
  end
end
